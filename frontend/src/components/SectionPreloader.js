import ClipLoader from "react-spinners/ClipLoader";

const SectionPreLoader = ({ message = false, retryCallBack = false }) => {
    const loading = true;
    const color = "#ffffff";

    return (
        <div className='section-preloader'>
            {message ? (
                <div className='section-preloader-message'>
                    <p>{message}</p>
                    <button className='native-submit-div-button' onClick={retryCallBack}>
                        Retry 
                    </button>
                </div>
            ) : (
                <ClipLoader
                    color={color}
                    loading={loading}
                    cssOverride={{
                        display: "block",
                        margin: "0 auto",
                        borderColor: "var(--primary-color)",
                    }}
                    size={80}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            )}
        </div>
    );
};

export default SectionPreLoader;
