import { get } from "enmity/api/settings";
import { getModule } from "enmity/metro";
import Manifest from './manifest.json';

const { SET_ACTIVITY } = getModule(m => typeof m.SET_ACTIVITY === 'object')

export function setActivity(activity) {
	return SET_ACTIVITY.handler({
		isSocketConnected: () => true,
		socket: {
			id: 100,
			application: {
				id: get(Manifest.name, 'applicationId'),
				name: activity ? activity.name : 'Presence'
			},
			transport: 'ipc',
		},
		args: {
			pid: 10,
			activity: activity,
		},
	});
}
