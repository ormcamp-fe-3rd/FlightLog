import useLoginModalStore from "@/store/useLoginModal";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function RegisterContent() {
  const { toggle } = useLoginModalStore();

  const schema = z
    .object({
      name: z.string().min(2, { message: "이름은 2글자 이상이어야 합니다." }),
      email: z.string().email({ message: "올바른 이메일을 입력해주세요." }),
      password: z
        .string()
        .min(5, { message: "비밀번호는 최소 5자 이상이어야 합니다." })
        .refine((val) => /[0-9]/.test(val), {
          message: "숫자를 포함해야 합니다.",
        })
        .refine((val) => /[!@#$%^&*]/.test(val), {
          message: "특수문자를 포함해야 합니다.",
        }),
      passwordConfirm: z
        .string()
        .min(5, { message: "비밀번호는 최소 5자 이상이어야 합니다." })
        .refine((val) => /[0-9]/.test(val), {
          message: "숫자를 포함해야 합니다.",
        })
        .refine((val) => /[!@#$%^&*]/.test(val), {
          message: "특수문자를 포함해야 합니다.",
        }),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      path: ["passwordConfirm"],
      message: "비밀번호가 일치하지 않습니다.",
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      tel: "",
      role: "",
      password: "",
      passwordConfirm: "",
    },
  });

  return (
    <>
      <div className="flex justify-between">
        <h2 className="mb-4 text-2xl font-bold text-black">Register</h2>
        <button className="btn btn-circle btn-ghost" onClick={toggle}>
          ✖️
        </button>
      </div>
      <form onSubmit={handleSubmit(onsubmit)} className="text-black" noValidate>
        <label htmlFor="name" className="label">
          <span className="label-text">name</span>
        </label>
        <input
          type="text"
          id="name"
          className={`input input-sm input-bordered w-full ${errors.name ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"} focus:outline-none`}
          required
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-error">{errors.name.message}</p>
        )}

        <label htmlFor="email" className="label">
          <span className="label-text">e-mail</span>
        </label>
        <input
          type="email"
          id="email"
          className={`input input-sm input-bordered w-full ${errors.email ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"} focus:outline-none`}
          required
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-error">{errors.email.message}</p>
        )}

        <label htmlFor="password" className="label">
          <span className="label-text">password</span>
        </label>
        <input
          type="password"
          id="password"
          className={`input input-sm input-bordered w-full ${errors.password ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"} focus:outline-none`}
          required
          {...register("password")}
        />
        {errors.password && (
          <p className="mt-1 text-xs text-error">{errors.password.message}</p>
        )}

        <label htmlFor="passwordConfirm" className="label">
          <span className="label-text">password confirm</span>
        </label>
        <input
          type="password"
          id="passwordConfirm"
          className={`input input-sm input-bordered w-full ${errors.passwordConfirm ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"} focus:outline-none`}
          required
          {...register("passwordConfirm")}
        />
        {errors.passwordConfirm && (
          <p className="mt-1 text-xs text-error">
            {errors.passwordConfirm.message}
          </p>
        )}

        <button type="submit" className="btn btn-primary mt-6 w-full">
          Register
        </button>
      </form>
    </>
  );
}
