import { get } from "enmity/api/settings";
import { GatewayActivity, GatewayActivityButton } from 'discord-api-types/v10';
import Manifest from './manifest.json';

interface Activity extends Partial<GatewayActivity> {
	buttons: GatewayActivityButton[] | undefined
	assets: Partial<Record<"large_image" | "large_text" | "small_image" | "small_text", string>> | undefined
}

export function getActivity(): Activity | undefined {
	let activity: Activity = {
		name: get(Manifest.name, 'name', undefined)?.toString(),
		type: Number(get(Manifest.name, 'type', undefined)),
		details: get(Manifest.name, 'details', undefined)?.toString(),
		state: get(Manifest.name, 'state', undefined)?.toString(),
		application_id: get(Manifest.name, 'applicationId', undefined)?.toString(),
		assets: {},
		buttons: [],
		timestamps: {
			// .toInteger() is used to convert the string to a number
			start: Number(get(Manifest.name, 'startTimestamp', undefined)),
			end: Number(get(Manifest.name, 'endTimestamp', undefined)),
		},
	}

	if (!activity.name) return undefined
	console.log("Got past activity.name check")

	// Images

	const largeImage = get(Manifest.name, 'largeImage', undefined)?.toString()
	const largeImageText = get(Manifest.name, 'largeImageText', undefined)?.toString()

	if (largeImage && activity.assets) {
		console.log("Adding large image")
		activity.assets.large_image = largeImage
		activity.assets.large_text = largeImageText
	}

	const smallImage = get(Manifest.name, 'smallImage', undefined)?.toString()
	const smallImageText = get(Manifest.name, 'smallImageText', undefined)?.toString()

	if (smallImage && activity.assets) {
		console.log("Adding small image")
		activity.assets.small_image = smallImage
		activity.assets.small_text = smallImageText
	}

	if (activity.assets && !activity.assets.large_image && !activity.assets.small_image) {
		console.log("No assets")
		activity.assets = undefined
	}

	// Buttons

	const button1Label = get(Manifest.name, 'button1Label', undefined)?.toString()
	const button1Url = get(Manifest.name, 'button1Url', undefined)?.toString()

	if (button1Label && button1Url && activity.buttons) {
		console.log("Adding button 1")
		const button: GatewayActivityButton = { label: button1Label, url: button1Url }
		activity.buttons.push(
			button
		)
	}

	const button2Label = get(Manifest.name, 'button2Label', undefined)?.toString()
	const button2Url = get(Manifest.name, 'button2Url', undefined)?.toString()

	if (button2Label && button2Url && activity.buttons) {
		console.log("Adding button 2")
		const button: GatewayActivityButton = { label: button2Label, url: button2Url }
		activity.buttons.push(
			button
		)
	}

	if (activity.buttons && activity.buttons.length === 0) {
		console.log("No buttons")
		activity.buttons = undefined
	}

	console.log(activity)

	return activity
}

export function hasAppIdAndName() {
	return get(Manifest.name, 'applicationId', false) && get(Manifest.name, 'name', false)
}
