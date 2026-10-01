import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <div className="m-0 p-0">
      <main className="flex items-center justify-center w-screen h-screen">
        <h1 className="text-center text-2xl font-semibold m-2">Welcome to Next.js Application</h1>
        <Button className="absolute top-5 right-5">Click Here</Button>
      </main>
    </div>
  );
}
