import classNames from "classnames";

export const Block = ({ children, onClick, isSelected, isEmpty, color }) => {
    return (
        <div
            onClick={onClick}
            className={classNames("size-4", {
                [color]: isSelected && !isEmpty,
                "bg-white/80": !isSelected && !isEmpty,
                "bg-transparent": isEmpty,
                "cursor-pointer": !isEmpty,
            })}>
            {children}
        </div>
    )
}