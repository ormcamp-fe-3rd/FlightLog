import useLoginModalStore from "@/store/useLoginModal";
import { formFields } from "@/util/common/RegsiterFormFormat";
import { useRegisterForm } from "@/util/common/RegsiterFormFormat";

export default function RegisterContent() {
  const { toggle } = useLoginModalStore();
  const { register, errors, isValid } = useRegisterForm();

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
        {formFields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="label label-text pb-0">
              {field.label}
            </label>
            <input
              type={field.type}
              id={field.id}
              placeholder={field.placeholder}
              className={`input input-sm input-bordered mt-1 w-full ${
                errors[field.id]
                  ? "border-red-500 focus:border-red-500"
                  : "focus:border-blue-500"
              } focus:outline-none`}
              required
              {...register(field.id, {
                required: "필수 입력 항목입니다",
              })}
            />
            {errors[field.id] && (
              <p className="mt-1 text-xs text-error">
                {errors[field.id]?.message as string}
              </p>
            )}
          </div>
        ))}

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
