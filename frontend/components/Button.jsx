
const Button = ({ children, className, onClick }) => {
	return (
		<button onClick={onClick} className={`px-4 py-2 rounded-md bg-violet-600 ${className}`}>
			{children}
		</button>
	);
}
 
export default Button;