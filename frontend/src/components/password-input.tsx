import * as React from "react";
import { Eye, EyeClosed, Lock } from "lucide-react";

import { Input, InputAdornment, InputRoot } from "@/components/ui/input";

function PasswordInput(props: Omit<React.ComponentProps<"input">, "type">) {
  const [visible, setVisible] = React.useState(false);

  return (
    <InputRoot>
      <InputAdornment>
        <Lock aria-hidden />
      </InputAdornment>
      <Input type={visible ? "text" : "password"} {...props} />
      <button
        type="button"
        aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        onClick={() => setVisible((current) => !current)}
        className="shrink-0 cursor-pointer text-gray-400 outline-none hover:text-gray-600 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring/50 [&_svg]:size-4"
      >
        {visible ? <Eye aria-hidden /> : <EyeClosed aria-hidden />}
      </button>
    </InputRoot>
  );
}

export { PasswordInput };
