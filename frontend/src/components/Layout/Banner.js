import '../../styles/Banner.scss';

const Banner = (props) => {
    return (
        <div className="banner">
            {props.children}
        </div>
    )
};

export default Banner;

