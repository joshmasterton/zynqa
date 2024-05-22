import './styles/Loading.scss';

export function Loading({isBackground = false}: {isBackground?: boolean}) {
	return (
		<div id='loading' className={isBackground ? 'background' : 'transparent'}>
			<div>
				<div/>
			</div>
		</div>
	);
}
