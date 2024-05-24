import './styles/Loading.scss';

export function Loading({
	isBackground = false, isSubtle = false,
}: {isBackground?: boolean; isSubtle?: boolean}) {
	return (
		<div id='loading' className={
			isBackground ? 'background' : `transparent${isSubtle ? 'Subtle' : ''}`
		}>
			<div>
				<div/>
			</div>
		</div>
	);
}
