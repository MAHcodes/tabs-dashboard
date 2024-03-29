import React from "react";
import classNames from "classnames";

import "./index.scss";

const Button = React.forwardRef(
  (
    {
      type,
      btnType,
      children,
      outline,
      rounded,
      className,
      disabled,
      block,
      size,
      isLoading,
      link,
      iconLeft,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        type={btnType}
        {...props}
        ref={ref}
        disabled={disabled}
        className={classNames(
          `btn`,
          {
            [`btn-${type}`]: true,
            outline,
            rounded,
            disabled: disabled || isLoading,
            block,
            link,
            [`btn-${size}`]: true,
          },
          className,
        )}
      >
        {iconLeft ? <i className={classNames("btn-icon", iconLeft)} /> : null}
        {isLoading ? <i className="loading-icon ri-loader-4-line" /> : null}
        {children}
      </button>
    );
  },
);

Button.defaultProps = {
  type: "primary", // default, danger, primary, success
  btnType: "button",
  outline: false,
  rounded: false,
  disabled: false,
  block: false,
  isLoading: false,
  link: false,
  size: "default",
};

export default Button;
