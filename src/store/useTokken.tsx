import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export default async function Page() {
  let session = await getServerSession(authOptions);
  return <>{console.log(session)}</>;
}
