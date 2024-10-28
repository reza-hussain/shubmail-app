import DOMPurify from "dompurify";
import { getRequest } from "./inbox";

export const fetchAttachment = async (activeEmail, messageId, attachmentId) => {
  try {
    const response = await getRequest({
      url: `/gmail/${activeEmail}/messages/${messageId}/get-attachment/${attachmentId}`,
    });

    return response.data
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .replace(/\s/g, ""); // Returns base64 data
  } catch (error) {
    console.error("Error fetching attachment:", error);
    return null;
  }
};

export const processEmailContent = async (
  htmlContent,
  attachments,
  activeEmail
) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");

  // Process all images
  const images = doc.getElementsByTagName("img");
  await Promise.all(
    Array.from(images).map(async (img) => {
      const src = img.getAttribute("src");

      if (!src) return;

      try {
        // Case 1: Handle Google content URLs
        if (src.includes("googleusercontent.com")) {
          //   console.log({ src });
          //   const dataUrl = await fetchGoogleImage(src, activeEmail);
          //   if (dataUrl) {
          //     img.setAttribute("src", dataUrl);
          //   } else {
          //     img.setAttribute("alt", "Image failed to load");
          //   }
        }
        // Case 2: Handle CID images
        else if (src.startsWith("cid:")) {
          const contentId = src.replace("cid:", "");
          const attachment = attachments.find(
            (att) => att.contentId === contentId
          );
          if (attachment) {
            img.setAttribute(
              "src",
              `data:${attachment.mimeType};base64,${attachment.data}`
            );
          }
        }
        // Case 3: Handle base64 images
        else if (
          src.includes("base64,") ||
          (!src.startsWith("data:") && !src.startsWith("http"))
        ) {
          let base64Data = src;
          let mimeType = "image/png";

          // If it's already a data URL, extract the base64 part
          if (src.includes("base64,")) {
            [, base64Data] = src.split("base64,");
            mimeType = src.split(":")[1]?.split(";")[0] || mimeType;
          }

          // Clean up the base64 data
          base64Data = base64Data
            .trim()
            .replace(/-/g, "+")
            .replace(/_/g, "/")
            .replace(/\s/g, "");

          img.setAttribute("src", `data:${mimeType};base64,${base64Data}`);
        }
      } catch (error) {
        console.error("Error processing image:", error);
        img.setAttribute("alt", "Image processing failed");
      }
    })
  );

  return doc.documentElement.outerHTML;
};

export const decodeAndCleanContent = (base64String) => {
  try {
    const decodedString = base64String;

    // Use TextDecoder to handle character encoding issues
    const textDecoder = new TextDecoder("utf-8");
    const encodedText = new Uint8Array(
      decodedString.split("").map((char) => char.charCodeAt(0))
    );
    const cleanedText = textDecoder.decode(encodedText);

    // Sanitize decoded content
    return DOMPurify.sanitize(cleanedText);
  } catch (error) {
    console.error("Error decoding Base64 string:", error);
    return ""; // Return empty string if there's an error
  }
};

export const fetchGoogleImage = async (imageUrl, activeEmail) => {
  try {
    const response = await getRequest({
      url: `/gmail/${activeEmail}/proxy-image`,
      params: {
        imageUrl: encodeURIComponent(imageUrl),
      },
      responseType: "blob",
    });

    console.log({ response });
    if (response) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(response);
      });
    }
    return null;
  } catch (error) {
    console.error("Error fetching Google image:", error);
    return null;
  }
};

export const formatReplyEmail = (originalEmail) => {
  if (!originalEmail) return "";

  const formattedDate = formatEmailDate(originalEmail.date);

  return `
    <br>
    <br>
    <div class="gmail-thread">
      <div class="gmail-message-quoted">
        <div style="border-left: 1px solid rgb(204, 204, 204); margin: 0px 0px 0px 8px; padding-left: 8px;">
          <div dir="ltr">
            <div class="gmail-quote">
              <div class="gmail-quote-header">
                On ${formattedDate}, ${originalEmail.from} wrote:
              </div>
              ${originalEmail.body}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// Format email for Forward
export const formatForwardEmail = (emailData) => {
  if (!emailData) return "";

  const formattedContent = emailData?.body.replace(
    /<blockquote>/g,
    '<blockquote class="gmail_quote" style="margin:0px 0px 0px 0.8ex;border-left:1px solid rgb(204,204,204);padding-left:1ex">'
  );

  return `
    <br>
    <br>
    <div class="gmail-thread">
      <div class="gmail-message-quoted">
        <div style="border-left: 1px solid rgb(204, 204, 204); margin: 0px 0px 0px 8px; padding-left: 8px;">
          <div dir="ltr">
            <div class="gmail-quote">
              <div class="gmail-forward-header" style="padding: 20px 0px 10px;">
                ---------- Forwarded message ---------<br/>
                From: ${emailData.from}<br/>
                Date:${emailData?.date} <br/>
                Subject: ${emailData.subject}<br/>
                To: ${emailData.to}<br/>
              </div>
              <br>
              <br>
              <div class="gmail-forward-content" style="margin-top: 20px;">
                ${formattedContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

const formatEmailDate = (date) => {
  return new Date(date).toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export const GmailClipboardModule = {
  // Attributes we want to preserve during paste operations
  GMAIL_ATTRIBUTES: [
    "class",
    "style",
    "dir",
    "rel",
    "data-gramm",
    "contenteditable",
  ],

  // Custom matcher function that preserves attributes
  matcherFunction: (node, Delta) => {
    // Preserve attributes for divs and blockquotes
    if (node.tagName === "DIV" || node.tagName === "BLOCKQUOTE") {
      const attributes = {};

      // Copy specified attributes if they exist
      GmailClipboardModule.GMAIL_ATTRIBUTES.forEach((attr) => {
        if (node.hasAttribute(attr)) {
          attributes[attr] = node.getAttribute(attr);
        }
      });

      // Preserve inline styles
      if (node.style && node.style.cssText) {
        attributes.style = node.style.cssText;
      }

      return {
        ...Delta,
        attributes,
      };
    }
    return Delta;
  },

  // Matchers for specific Gmail classes
  matchers: [
    [
      "div.gmail-thread",
      function (node, delta) {
        return GmailClipboardModule.matcherFunction(node, delta);
      },
    ],
    [
      "div.gmail_quote",
      function (node, delta) {
        return GmailClipboardModule.matcherFunction(node, delta);
      },
    ],
    [
      "blockquote.gmail_quote",
      function (node, delta) {
        const gmailStyles = {
          margin: "0px 0px 0px 0.8ex",
          "border-left": "1px solid rgb(204,204,204)",
          "padding-left": "1ex",
        };

        node.style.cssText = Object.entries(gmailStyles)
          .map(([key, value]) => `${key}: ${value}`)
          .join("; ");

        return GmailClipboardModule.matcherFunction(node, delta);
      },
    ],
  ],
};
