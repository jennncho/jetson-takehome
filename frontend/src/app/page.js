import Image from "next/image";
import TopTenEmployees from "../../components/TopTenEmployees";

export default function Dashboard() {
    return (
        <div>
            <div>Happy Pizza Dashboard</div>
            <TopTenEmployees />
        </div>
    );
}
