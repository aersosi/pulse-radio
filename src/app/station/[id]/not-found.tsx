import BtnToTop100 from "@/components/BtnToOverview";

export default function StationNotFound() {
    return (
        <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-red-500 mb-4">
                Station Not Found
            </h2>
            <p className="mb-6">
                The radio station you are looking for does not exist or is not available.
            </p>
            <BtnToTop100/>
        </div>
    );
}