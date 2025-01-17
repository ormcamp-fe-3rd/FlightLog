import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const schema = z
  .object({
    name: z
      .string()
      .min(2, { message: "이름은 2글자 이상이어야 합니다." })
      .refine((val) => /^[가-힣a-zA-Z\s]+$/.test(val), {
        message: "이름에는 한글, 영문만 입력 가능합니다.",
      }),
    email: z
      .string()
      .email({ message: "올바른 이메일을 입력해주세요." })
      .refine(
        (val) => /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(val),
        {
          message: "올바른 이메일 형식이 아닙니다.",
        },
      ),
    password: z
      .string()
      .min(5, { message: "비밀번호는 최소 5자 이상이어야 합니다." })
      .refine((val) => /[0-9]/.test(val), {
        message: "숫자를 포함해야 합니다.",
      })
      .refine((val) => /[!@#$%^&*]/.test(val), {
        message: "특수문자를 포함해야 합니다.",
      }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호가 일치하지 않습니다.",
  });

const formFields = [
  {
    label: "이름",
    id: "name" as const,
    type: "text",

    placeholder: "한글 혹은 영문으로 2글자 이상 입력해주세요",
  },
  {
    label: "이메일",
    id: "email" as const,
    type: "email",

    placeholder: "이메일 형식으로 입력해주세요",
  },
  {
    label: "비밀번호",
    id: "password" as const,
    type: "password",

    placeholder: "숫자, 특수문자를 포함한 5자 이상 입력해주세요.",
  },
  {
    label: "비밀번호 확인",
    id: "passwordConfirm" as const,
    type: "password",

    placeholder: "위와 동일한 비밀번호를 입력해주세요",
  },
];

const useRegisterForm = () => {
  const {
    register,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
    mode: "onChange",
  });

  return { register, errors, isValid };
};

export { schema, formFields, useRegisterForm };
