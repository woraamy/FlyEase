"use client"
import Link from "next/link";
import { BsFileBarGraphFill } from "react-icons/bs";
import { MdWorkHistory } from "react-icons/md";
import { RiInformation2Fill } from "react-icons/ri";
import { usePathname } from 'next/navigation';
import { FolderKanban, Plane, UserPen } from 'lucide-react';

export default function ProfileSidenav() {
    const pathname = usePathname();
    const investpage = pathname === `/profile` ? "bg-[#EAF0EC] text-[#73a47f]  rounded-xl" : "" ;
    const historypage = pathname.startsWith(`/profile/my-flights`) ? "bg-[#EAF0EC] text-[#73a47f] p-3 rounded-xl" : "";
    const informationpage = pathname.startsWith(`/profile/my-travel-plans`) ? "bg-[#EAF0EC] text-[#73a47f] p-3 rounded-xl" : "";

    return(
        <div className="overflow-hidden flex bg-white sticky top-0 left-0 h-[100vh] w-[20%] xl:w-[15%] text-[#1f2022]">
            <div className="relative ml-[20%] mt-20 w-[70%] ">
                <span className="p-3">MENU</span>
                <div className={`flex p-3 mt-2 ${investpage}`}>
                    < UserPen />
                    <Link href={`/profile`} className="ml-2">Profile</Link>
                </div>
                <div className={`flex mt-2 p-3 ${historypage}`}>
                    < Plane />
                    <Link href={`/profile/flights`} className="ml-2">My Flights</Link>
                </div>
                <div className={`flex mt-2 p-3 ${informationpage}`}>
                    < FolderKanban />
                    <Link href={`/profile/travel-plans`} className="ml-2">My Travel Plans</Link>
                </div>
            </div>
        </div>
    );
};