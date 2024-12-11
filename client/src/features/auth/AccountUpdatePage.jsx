import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { authService } from "@/services/authService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PropTypes from "prop-types";
import AvatarUploadPage from "./AvatarUploadPage";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/date-picker";
import { Mention, MentionsInput } from "react-mentions";

const genderSelectOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
  { label: "Prefer not to say", value: "prefer not to say" },
];

const relationshipSelectOptions = [
  { label: "Single", value: "single" },
  { label: "In a relationship", value: "in a relationship" },
  { label: "Married", value: "married" },
  { label: "It's complicated", value: "it's complicated" },
];

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z
    .string()
    .regex(/^[a-z]+$/, "Username must be lowercase letters with no spaces"),
  email: z.string().email("Please enter a valid email liveIn"),
  bio: z.string().optional().nullable(), // Allow null or undefined
  gender: z.enum(["male", "female", "other", "prefer not to say"]),
  dob: z.string().optional().nullable(), // Allow null or undefined
  liveIn: z.string().optional().nullable(), // Allow null or undefined
  relationship: z.enum([
    "single",
    "in a relationship",
    "married",
    "it's complicated",
  ]),
  partner: z.string().optional().nullable(), // Allow null or undefined
  annidate: z.string().optional().nullable(), // Allow null or undefined
});
export default function AccountUpdatePage({ user }) {
  const { updateProfile, successType, errorType } = authService();
  const { toast } = useToast();

  const accountUpdateForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      bio: "",
      gender: "Prefer not to say",
      dob: "",
      liveIn: "",
      relationship: "Single",
      partner: "",
      annidate: "",
    },
  });

  const updateAccount = async (data) => {
    const {
      name,
      username,
      email,
      bio,
      gender,
      dob,
      liveIn,
      relationship,
      partner,
      annidate,
    } = data;
    try {
      await updateProfile({
        name,
        username,
        email,
        bio,
        gender,
        dob,
        liveIn,
        relationship,
        partner,
        annidate,
      });
    } catch (error) {
      console.error("Error changing Profile:", error);
      toast({
        title: "Error",
        description:
          error.message ||
          "There was an issue updating your profile. Please try again.",
      });
    }
  };

  // Use useEffect to handle data fetching and form reset
  useEffect(() => {
    if (user) {
      accountUpdateForm.reset({
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        gender: user.gender || "prefer not to say",
        dob: user.dob,
        liveIn: user.liveIn,
        relationship: user.relationship || "single",
        partner: user.partner,
        annidate: user.annidate,
      });
    }
  }, [user, accountUpdateForm]);

  useEffect(() => {
    if (successType === "updated-profile") {
      toast({
        title: "Profile Updated",
        description: "Your Profile has been updated successfully.",
      });
    }

    if (errorType === "error") {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "There was an issue updating your profile. Please try again.",
      });
    }
  }, [successType, toast]);

  const [friendlist, setFriendlist] = useState([]);

  const friends = user?.friends;
  const friendships = user?.friendships;

  useEffect(() => {
    let allFriends = [];

    friends?.forEach((friend) => {
      allFriends.push({ id: friend.user.username, display: friend.user.name });
    });

    friendships?.forEach((friendship) => {
      allFriends.push({
        id: friendship.friend.username,
        display: friendship.friend.name,
      });
    });

    setFriendlist(allFriends);
  }, [friends, friendships]);

  const relationship = accountUpdateForm.watch("relationship");
  const isDisabled = relationship === "single";

  return (
    <Card className="max-w-4xl mx-auto mb-4">
      <CardHeader>
        <CardTitle className="text-xl">Account Settings</CardTitle>
        <CardDescription>
          Update your account information and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AvatarUploadPage />

        <Separator />
        <Form {...accountUpdateForm}>
          <form
            onSubmit={accountUpdateForm.handleSubmit(updateAccount)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={accountUpdateForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={accountUpdateForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={accountUpdateForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={accountUpdateForm.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange} // Updates form state when a value is selected
                        value={field.value} // Binds the field value to the Select component
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {genderSelectOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={accountUpdateForm.control}
                name="liveIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>liveIn</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={accountUpdateForm.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          {relationshipSelectOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={accountUpdateForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={accountUpdateForm.control}
                name="partner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Partner{" "}
                      <span className="font-normal">
                        {" "}
                        First type "@" and then choose username{" "}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <MentionsInput
                        value={field.value || ""}
                        onChange={field.onChange}
                        className="min-h-10 border border-input rounded-md"
                        disabled={isDisabled}
                      >
                        <Mention data={friendlist} />
                      </MentionsInput>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={accountUpdateForm.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      className="mb-4" // Optional styling
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={accountUpdateForm.control}
                name="annidate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Anni Date</FormLabel>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      className="mb-4" // Optional styling
                      disabled={isDisabled}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Save Change</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

AccountUpdatePage.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    bio: PropTypes.string,
    gender: PropTypes.string,
    dob: PropTypes.string,
    liveIn: PropTypes.string,
    relationship: PropTypes.string,
    partner: PropTypes.string,
    annidate: PropTypes.string,
  }),
};
