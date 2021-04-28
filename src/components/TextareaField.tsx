import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { TextareaHTMLAttributes } from "react";

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  name: string;
  height: string;
  maxW?: string;
};

const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  height,
  ...props
}: TextareaFieldProps) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error} isRequired>
      <FormLabel htmlFor={field.name} id={field.name + "label"} fontSize="sm">
        {label}
      </FormLabel>
      <Textarea
        {...field}
        {...props}
        name={field.name}
        height={height}
        placeholder={props.placeholder}
        bg="white"
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export default TextareaField;
