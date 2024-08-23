import Navbar from "@/components/Navbar";

export const metadata = {
    title: "Booking | VillaAcapella",
    description: "Discover our cozy and luxurious cabins in the heart of the Sousse.",
};

export default function Layout({ children }:any) {
    return <>
    <Navbar/>
    {children}
    </>;
}