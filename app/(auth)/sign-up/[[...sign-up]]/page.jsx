import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="bg-white" style={{ backgroundImage: 'url(/cabin_img.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="/cabin_img.jpg"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main className="flex items-center justify-center h-screen lg:col-span-7 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <SignUp />
          </div>
        </main>
      </div>
    </section>
  );
}
