
export function nameValidator(name: string): boolean {
	const nameRegex = /^[a-zA-Z0-9_\-']{3,20}$/
	return nameRegex.test(name)
}

export function kolokNameValidator(name: string): boolean {
	const nameRegex = /^[a-zA-Z0-9_\-' ]{3,25}$/
	return nameRegex.test(name)
}