import React from "react";

const Logo = ({ ...rest }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g clipPath="url(#clip0_406_2089)">
        <path
          d="M1.225 8.46712C1.331 8.34412 8.48 1.44912 8.48 1.44912C9.4223 0.524611 10.6905 0.00794686 12.0106 0.0107536C13.3307 0.0135603 14.5966 0.535612 15.535 1.46412C15.535 1.46412 22.669 8.34412 22.774 8.46412L14.121 17.1181C13.5493 17.6631 12.7898 17.9671 12 17.9671C11.2102 17.9671 10.4507 17.6631 9.879 17.1181L1.225 8.46712ZM15.535 18.5361C14.5943 19.4676 13.3239 19.9902 12 19.9902C10.6761 19.9902 9.40572 19.4676 8.465 18.5361L0.229 10.3001C0.0852498 10.756 0.00811962 11.2302 0 11.7081L0 19.0001C0.00158786 20.3257 0.528882 21.5966 1.46622 22.5339C2.40356 23.4712 3.67441 23.9985 5 24.0001H19C20.3256 23.9985 21.5964 23.4712 22.5338 22.5339C23.4711 21.5966 23.9984 20.3257 24 19.0001V11.7081C23.9919 11.2302 23.9148 10.756 23.771 10.3001L15.535 18.5361Z"
          fill="#374957"
        />
      </g>
      <defs>
        <clipPath id="clip0_406_2089">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Logo;
