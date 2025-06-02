import React from "react";
import { Button as AntdButton, ButtonProps as AntdButtonProps } from "antd";

type ButtonColor = "primary" | "default" | "danger";
type ButtonVariant = "solid" | "outlined" | "link";

export interface CustomButtonProps extends Omit<AntdButtonProps, "type"> {
	color?: ButtonColor; // primary
	variant?: ButtonVariant; // solid, outlined, link
	label?: string;
	className?: string;
}

const GenericButton: React.FC<CustomButtonProps> = ({
	color = "default",
	variant = "solid",
	label,
	className,
	...rest
}) => {
	return (
		<AntdButton color={color} variant={variant} {...rest} className={className}>
			{label}
		</AntdButton>
	);
};

export default GenericButton;
