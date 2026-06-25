type FeatureBlockProps = {
    title: string;
    description: string;
};

export default function FeatureBlock({ title, description }: FeatureBlockProps) {
    return (
        <div className="d-flex flex-column justify-content-start mb-4 col-lg-5 col-md-12">
            <h4>{title}</h4>
            <p className="mb-0 font-size-5 fw-light">{description}</p>
        </div>
    );
}
