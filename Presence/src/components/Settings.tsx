import { Button, FormInput, FormRow, FormSection, FormSwitch, KeyboardAvoidingView, ScrollView, Text, View } from 'enmity/components';
import { SettingsStore } from 'enmity/api/settings';
import { Linking, React } from 'enmity/metro/common';
import { getActivity } from '../activity';
import { setActivity } from '../rpc';
import { hasAppIdAndName } from '../activity';

interface SettingsProps {
	settings: SettingsStore;
}

export default ({ settings }: SettingsProps) => {
	const basicData = [
		{ item: 'Name', placeholder: 'Apeture Science' },
		{ item: 'Details', placeholder: 'Cooperative Testing Initiative' },
		{ item: 'State', placeholder: 'Testing²' },
		{ item: 'Type', placeholder: '0: Playing, 1: Streaming, 2: Listening, 3: Watching, 5: Competing' },
	]
	const timestampData = [
		'Start',
		'End',
	]
	const imageData = [
		{ image: 'Large', placeholder_url: 'teambuilding_testchamber01', placeholder: 'Team Building Test Chamber 01' },
		{ image: 'Small', placeholder_url: 'apeture_science', placeholder: 'Apeture Science' },
	]
	const buttonData = [
		{ button: 1, placeholder_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', placeholder: 'Watch' },
		{ button: 2, placeholder_url: 'https://store.steampowered.com/app/620/Portal_2/', placeholder: 'Buy Portal 2' },
	]

	React.useEffect(() =>
		() => {
			if (hasAppIdAndName()) {
				console.log("Setting activity on settings close")
				setActivity(getActivity())
			} else {
				setActivity(undefined)
			}
		}, [])

	return <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
		<ScrollView>
			<FormSection title="Basic">
				<FormInput
					value={settings.get('applicationId')}
					onChange={(value) => settings.set('applicationId', value || undefined)}
					title="Application ID"
					placeholder="12345678910"
				/>
				{basicData.map(({ item, placeholder }) =>
					<FormInput
						value={settings.get(item.toLowerCase())}
						onChange={(value) => settings.set(item.toLowerCase(), value || undefined)}
						title={item}
						placeholder={placeholder}
					/>
				)}
			</FormSection>
			<FormSection title="Timestamps">
				{timestampData.map((timestamp) => 
					<FormInput
						value={settings.get(`${timestamp.toLowerCase()}Timestamp`)}
						onChange={(value) => settings.set(`${timestamp.toLowerCase()}Timestamp`, value || undefined)}
						title={`${timestamp} timestamp`}
						placeholder="12345678910 (in ms)"
					/>
				)}
			</FormSection>
			<FormSection title="Images">
				{imageData.map(({ image, placeholder, placeholder_url }) =>
					<>
						<FormInput
							value={settings.get(`${image.toLowerCase()}Image`)}
							onChange={(value) => settings.set(`${image.toLowerCase()}Image`, value || undefined)}
							title={`${image} image asset or URL`}
							placeholder={placeholder_url}
						/>
						<FormInput
							value={settings.get(`${image.toLowerCase()}ImageText`)}
							onChange={(value) => settings.set(`${image.toLowerCase()}ImageText`, value || undefined)}
							title={`${image} image text`}
							placeholder={placeholder}
						/>
					</>
				)}
			</FormSection>
			<FormSection title="Buttons">
				{buttonData.map(({ button, placeholder, placeholder_url }) =>
					<>
						<FormInput
							value={settings.get(`button${button}Label`)}
							onChange={(value) => settings.set(`button${button}Label`, value || undefined)}
							title={`Button ${button} label`}
							placeholder={placeholder}
						/>
						<FormInput
							value={settings.get(`button${button}Url`)}
							onChange={(value) => settings.set(`button${button}Url`, value || undefined)}
							title={`Button ${button} URL`}
							placeholder={placeholder_url}
						/>
					</>
				)}
			</FormSection>
			<View style={{ marginBottom: 50 }} />
			<Text style={{ textAlign: 'center', color: '#fff', fontSize: 12 }}>Developers: <Text style={{ color: '#7289da' }} onPress={() => Linking.openURL('https://fiery.gay/')}>Fiery</Text> and <Text style={{ color: '#7289da' }} onPress={() => Linking.openURL('https://connor.is-a.dev')}>Connor</Text></Text>
			<View style={{ marginBottom: 50 }} />
		</ScrollView>
	</KeyboardAvoidingView>;
};
