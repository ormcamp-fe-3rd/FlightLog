import useLoginModalStore from "@/store/useLoginModal";

export default function RegisterContent() {
  const { toggle } = useLoginModalStore();
  return (
    <>
      <div className="flex justify-between">
        <h2 className="mb-4 text-2xl font-bold text-black">Register</h2>
        <button
          className="btn btn-circle btn-ghost text-black"
          onClick={toggle}
        >
          ✖️
        </button>
      </div>
      <form>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            name
          </label>
          <input
            type="text"
            id="text"
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:ring focus:ring-gray-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            e-mail
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:ring focus:ring-gray-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:ring focus:ring-gray-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-black py-2 transition duration-300 hover:bg-gray-500"
        >
          Register
        </button>
      </form>
    </>
  );
}
