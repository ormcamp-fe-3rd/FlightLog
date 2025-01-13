import useLoginModalStore from "@/store/useLoginModal";
import { useForm } from "react-hook-form";

export default function LoginContent() {
  const { toggle } = useLoginModalStore();

  const {
    register,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <>
      <div className="flex justify-between">
        <h2 className="mb-4 text-2xl font-bold text-black">로그인</h2>
        <button className="btn btn-circle btn-ghost" onClick={toggle}>
          ✖️
        </button>
      </div>

      <form className="text-black" noValidate>
        <label htmlFor="email" className="label label-text pb-0">
          이메일
        </label>
        <input
          {...register("email", { required: true })}
          type="email"
          id="email"
          className="input input-sm input-bordered mt-1 w-full focus:border-blue-500 focus:outline-none"
          required
        />

        <label htmlFor="password" className="label label-text mt-2 pb-0">
          비밀번호
        </label>
        <input
          {...register("password", { required: true })}
          type="password"
          id="password"
          className="input input-sm input-bordered mt-1 w-full focus:border-blue-500 focus:outline-none"
          required
        />

        <button
          type="submit"
          className={`btn mt-8 w-full ${isValid ? "btn-primary" : "btn-disabled"}`}
          disabled={!isValid}
        >
          로그인
        </button>
      </form>
    </>
  );
}
