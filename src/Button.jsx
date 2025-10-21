import classNames from 'classnames';

export const Button = ({ children, onClick, active, color }) => {
    return (
        <button className={classNames(color, {
            "transition-all duration-300": true,
            "p-2 rounded-md border-2 hover:border-black": true,
            "border-white text-white": !active,
            "border-black text-black": active,
        })} onClick={onClick}>
            {children}
        </button>
    )
}