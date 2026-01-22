import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNotifications } from "@/components/ui/notifications";
import { Textarea } from "@/components/ui/textarea";
import { handleFormError } from "@/lib/utils";
import { createPostInputSchema, useCreatePost } from "../api/create-post";

type FormData = z.infer<typeof createPostInputSchema>;

interface PostCreateFormProps {
   onCreateSuccess: () => void;
}

export default function PostCreateForm({
   onCreateSuccess,
}: Readonly<PostCreateFormProps>) {
   const { addNotification } = useNotifications();
   const createPostMutation = useCreatePost({
      mutationConfig: {
         onError: (error) => {
            handleFormError(error, form);
         },
         onSuccess: () => {
            addNotification({
               type: "success",
               title: "Success",
               message: "Post created successfully",
            });
            onCreateSuccess();
            form.reset();
         },
      },
   });

   // 1. Define your form.
   const form = useForm<FormData>({
      resolver: zodResolver(createPostInputSchema),
      defaultValues: {
         title: "",
         body: "",
         userId: 1, // Assuming userId is optional and can be set later
      },
   });

   // 2. Define a submit handler.
   const onSubmit: SubmitHandler<FormData> = (values) => {
      createPostMutation.mutate({ data: values });
   };

   return (
      <div>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
               <Card>
                  <CardHeader>
                     <CardTitle>Post Informations</CardTitle>
                     <CardDescription>
                        Enter the details of your new post.
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Post Title</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Enter post title"
                                    {...field}
                                 />
                              </FormControl>
                              <FormDescription>
                                 The name of your post as it will appear to
                                 customers.
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="body"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Body</FormLabel>
                              <FormControl>
                                 <Textarea
                                    placeholder="Describe your post..."
                                    className="min-h-32 resize-y"
                                    {...field}
                                 />
                              </FormControl>
                              <FormDescription>
                                 Provide a detailed description of your post.
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                     <Button type="button" variant="outline">
                        Cancel
                     </Button>
                     <Button
                        type="submit"
                        disabled={createPostMutation.isPending}
                     >
                        Create Post
                     </Button>
                  </CardFooter>
               </Card>
            </form>
         </Form>
      </div>
   );
}
