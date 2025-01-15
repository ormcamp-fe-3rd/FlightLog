import useLoginModalStore from "@/store/useLoginModal";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function RegisterContent() {
  const { toggle } = useLoginModalStore();

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

  const {
    register,
    trigger,
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

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="mb-4 text-2xl font-bold text-black">회원 가입</h2>
        <button className="btn btn-circle btn-ghost" onClick={toggle}>
          ✖️
        </button>
      </div>
      <form
        method="POST"
        action="/api/auth/register"
        className="text-black"
        noValidate
      >
        <label htmlFor="name" className="label label-text pb-0">
          이름
        </label>
        <input
          type="text"
          id="name"
          placeholder="한글 혹은 영문으로 2글자 이상 입력해주세요"
          className={`input input-sm input-bordered mt-1 w-full ${errors.name ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"} focus:outline-none`}
          required
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-error">{errors.name.message}</p>
        )}

        <label htmlFor="email" className="label label-text mt-2 pb-0">
          이메일
        </label>
        <input
          type="email"
          id="email"
          placeholder="이메일 형식으로 입력해주세요"
          className={`input input-sm input-bordered mt-1 w-full ${errors.email ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"} focus:outline-none`}
          required
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-error">{errors.email.message}</p>
        )}

        <label htmlFor="password" className="label label-text mt-2 pb-0">
          비밀번호
        </label>
        <input
          type="password"
          id="password"
          placeholder="숫자, 특수문자를 포함한 5자 이상 입력해주세요."
          className={`input input-sm input-bordered mt-1 w-full ${
            errors.password
              ? "border-red-500 focus:border-red-500"
              : "focus:border-blue-500"
          } focus:outline-none`}
          required
          {...register("password", {
            onChange: (e) => {
              if (e.target.form.passwordConfirm.value !== "") {
                trigger("passwordConfirm");
              }
            },
          })}
        />
        {errors.password && (
          <p className="mt-1 text-xs text-error">{errors.password.message}</p>
        )}

        <label htmlFor="passwordConfirm" className="label label-text mt-2 pb-0">
          비밀번호 확인
        </label>
        <input
          type="password"
          id="passwordConfirm"
          placeholder="위와 동일한 비밀번호를 입력해주세요"
          className={`input input-sm input-bordered mt-1 w-full ${errors.passwordConfirm ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"} focus:outline-none`}
          required
          {...register("passwordConfirm")}
        />
        {errors.passwordConfirm && (
          <p className="mt-1 text-xs text-error">
            {errors.passwordConfirm.message}
          </p>
        )}

        <button
          type="submit"
          className={`btn mt-8 w-full ${
            isValid ? "btn-primary" : "btn-disabled"
          }`}
          disabled={!isValid}
        >
          가입하기
        </button>
      </form>
    </div>
  );
}
