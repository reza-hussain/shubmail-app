// Importing helper modules
import { useCallback, useEffect, useMemo, useRef } from "react";

// Importing core components
import QuillEditor from "react-quill";

// Importing styles
import "react-quill/dist/quill.snow.css";
import { useStateValue } from "../../context/StateProvider";

import {
  formatForwardEmail,
  formatReplyEmail,
  GmailClipboardModule,
} from "../../services/utils";

const Editor = ({ value, setValue, isForward }) => {
  const { emailData } = useStateValue();

  // Editor ref
  const quill = useRef();

  const imageHandler = useCallback(() => {
    // Create an input element of type 'file'
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    // When a file is selected
    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();

      // Read the selected file as a data URL
      reader.onload = () => {
        const imageUrl = reader.result;
        const quillEditor = quill.current.getEditor();

        // Get the current selection range and insert the image at that index
        const range = quillEditor.getSelection(true);
        quillEditor.insertEmbed(range.index, "image", imageUrl, "user");
      };

      reader.readAsDataURL(file);
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],

        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: false,
        matchers: GmailClipboardModule.matchers,
        allowCustomCopy: true,
        preserveWhitespace: true,
      },
    }),
    [imageHandler]
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "clean",
    "blockquote",
    "gmail-thread",
    "gmail-quote",
    "gmail_quote",
  ];
  useEffect(() => {
    if (emailData?.threadData?.length > 1) {
      const lastIndex = emailData?.threadData?.length - 1;
      const lastItem = emailData?.threadData?.[lastIndex];

      if (isForward) {
        const body = formatForwardEmail({ ...emailData, date: lastItem.date });
        setValue(body);
      } else {
        const body = formatReplyEmail({ ...emailData, date: lastItem.date });
        setValue(body);
      }
    }

    // eslint-disable-next-line
  }, [emailData]);

  return (
    <div className="flex-grow w-full min-h-[55%] mb-4 quill-component">
      <QuillEditor
        ref={(el) => (quill.current = el)}
        theme="snow"
        value={value}
        formats={formats}
        modules={modules}
        onChange={(value) => setValue(value)}
        className="h-full w-full"
      />
    </div>
  );
};

export default Editor;
