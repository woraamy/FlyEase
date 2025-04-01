"use client"
import Link from "next/link";
import { BsFileBarGraphFill } from "react-icons/bs";
import { MdWorkHistory } from "react-icons/md";
import { RiInformation2Fill } from "react-icons/ri";
import { usePathname } from 'next/navigation';
import { FolderKanban, Plane, UserPen } from 'lucide-react';

export default function ProfileSidenav() {
    const pathname = usePathname();
    const profilepage = pathname === `/profile` ? "bg-[#EAF0EC] text-[#73a47f]  rounded-xl" : "" ;
    const bookingpage = pathname.startsWith(`/profile/my-flights`) ? "bg-[#EAF0EC] text-[#73a47f] p-3 rounded-xl" : "";

    return(
        <div className="overflow-hidden flex bg-white sticky top-0 left-0 h-[100vh] w-[20%] xl:w-[15%] text-[#1f2022]">
            <div className="relative ml-[20%] mt-20 w-[70%] ">
                <span className="p-3">MENU</span>
                <Link href={`/profile`} className="ml-2 align-middle">
                    <div className={`flex items-center gap-2 p-3 mt-2 ${profilepage}`}>
                        < UserPen />
                        <p>Profile</p>
                    </div>
                </Link>
                <Link href={`/profile/my-flights`} className="ml-2 align-middle">
                    <div className={`flex items-center gap-2 p-3 -mt-5 ${bookingpage}`}>
                        < Plane />
                        <p>My Flights</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};