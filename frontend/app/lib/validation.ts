
export function nameValidator(name: string): boolean {
	const nameRegex = /^[a-zA-Z0-9_\-']{3,20}$/
	return nameRegex.test(name)
}

export function kolokNameValidator(name: string): boolean {
	const nameRegex = /^[a-zA-Z0-9_\-' ]{3,25}$/
	return nameRegex.test(name)
}

export function urlBase64ToUint8Array(base64String: string):  Uint8Array<ArrayBuffer> {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding)
		.replace(/-/g, '+')
		.replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}