interface ResultURLProps {
    url: string;
}

export const ResultURL = ({ url }: ResultURLProps) => {
    return (
        <div className="border-4 border-white p-6 mt-8 text-left w-full">
            <h2 className="text-xl font-bold mb-4">This URL redirects to:</h2>
            <p className="text-lg text-gray-400 break-all">{url}</p>
        </div>
    );
};
