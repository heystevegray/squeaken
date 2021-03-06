import { useMutation } from "@apollo/client";
import { Form, FormField, Box, CheckBox } from "grommet";
import { useState } from "react";
import { CREATE_PROFILE } from "../../../graphql/mutations";
import { GET_VIEWER } from "../../../graphql/queries";
import { LoadingButton } from "../../Buttons/LoadingButton";
import CharacterCountLabel from "../../CharacterCountLabel";
import RequiredLabel from "../../RequiredLabel";
import {
	getUsernameErrors,
	validateDescription,
	validateUsername,
} from "../EditProfileForm";
import FormFieldContainer from "../FormFieldContainer";

interface Props {
	accountId: string;
	updateViewer: React.Dispatch<React.SetStateAction<null>>;
}

const CreateProfileForm = ({ accountId, updateViewer }: Props) => {
	const [descCharCount, setDescCharCount] = useState(0);
	const [isFullNameHidden, setIsFullNameHidden] = useState(false);
	const [createProfile, { error: createProfileError, loading }] = useMutation(
		CREATE_PROFILE,
		{
			update: (cache, { data: { createProfile } }) => {
				// @ts-ignore
				const { viewer } = cache.readQuery({ query: GET_VIEWER });
				const viewerWithProfile = { ...viewer, profile: createProfile };
				cache.writeQuery({
					query: GET_VIEWER,
					data: { viewer: viewerWithProfile },
				});
				updateViewer(viewerWithProfile);
			},
		}
	);

	return (
		<Form
			messages={{ required: "This field is required 😬" }}
			errors={{
				username: getUsernameErrors(createProfileError),
			}}
			onSubmit={(event: any) => {
				createProfile({
					variables: {
						data: {
							accountId,
							isFullNameHidden,
							...event.value,
						},
					},
				}).catch((error) => {
					console.error(error);
				});
			}}
		>
			<FormFieldContainer
				button={
					<LoadingButton loading={loading} label="Save Profile" />
				}
			>
				<FormField
					htmlFor="username"
					id="username"
					label={<RequiredLabel>Username</RequiredLabel>}
					name="username"
					required
					placeholder="Pick a unique username"
					validate={(fieldData) => validateUsername(fieldData)}
				/>

				<FormField
					htmlFor="fullName"
					id="fullName"
					label="Full Name"
					name="fullName"
					placeholder="Add your full name"
				/>

				<FormField
					htmlFor="hideFullName"
					id="hideFullName"
					name="hideFullName"
				>
					<Box pad={{ bottom: "medium", top: "medium" }}>
						<CheckBox
							checked={isFullNameHidden}
							label="Hide your full name from squeaken"
							onChange={(event) => {
								setIsFullNameHidden(event.target.checked);
							}}
						/>
					</Box>
				</FormField>

				<FormField
					htmlFor="description"
					id="description"
					label={
						<CharacterCountLabel
							currentCharacters={descCharCount}
							label="Description"
							max={256}
						/>
					}
					name="description"
					placeholder="Write a short bio or description about yourself"
					onInput={(event: any) => {
						const characterCount = event.target.value.length;
						setDescCharCount(characterCount);
					}}
					validate={(fieldData) => validateDescription(fieldData)}
				/>
			</FormFieldContainer>
		</Form>
	);
};

export default CreateProfileForm;
