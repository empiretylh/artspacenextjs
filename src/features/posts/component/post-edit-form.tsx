import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import LoadingPage from "@/components/page/loading-page";
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
import { useGetPost } from "../api/get-post";
import { updatePostInputSchema, useUpdatePost } from "../api/update-post";

// Define the type for form data based on the Zod schema
type FormData = z.infer<typeof updatePostInputSchema>;

interface PostEditFormProps {
   postId?: number; // Optional post ID for editing an existing post
   onUpdateSuccess: () => void;
}

export default function PostEditForm({
   postId,
   onUpdateSuccess,
}: Readonly<PostEditFormProps>) {
   const { addNotification } = useNotifications();

   const postQuery = useGetPost({ postId: String(postId) });

   const post = postQuery?.data?.data ?? null;

   // 1. Define your form.
   const form = useForm<FormData>({
      resolver: zodResolver(updatePostInputSchema),
      values: {
         title: post?.title ?? "",
         body: post?.body ?? "",
      },
      // Use `defaultValues` if post data is not immediately available,
      // otherwise `values` is better for pre-filling fetched data.
      // However, `useForm`'s `values` prop is controlled, meaning updates to `post`
      // will re-render and update the form.
   });

   const updatePostMutation = useUpdatePost({
      mutationConfig: {
         onError: (error) => {
            handleFormError(error, form);
         },
         onSuccess: () => {
            addNotification({
               type: "success",
               title: "Success",
               message: "Post updated successfully",
            });
            onUpdateSuccess();
            form.reset(); // Reset form fields
         },
      },
   });

   if (postQuery.isLoading) {
      return <LoadingPage />;
   }

   if (!post) {
      return null; // Or show an error message, "Post not found"
   }

   // 2. Define a submit handler.
   const onSubmit: SubmitHandler<FormData> = (values) => {
      updatePostMutation.mutate({ data: values, postId: String(post.id) });
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <Card>
               <CardHeader>
                  <CardTitle>Post Information</CardTitle>
                  <CardDescription>
                     Update the details of your post.
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
                              The title of your post as it will appear to
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
                  <Button type="submit" disabled={updatePostMutation.isPending}>
                     Update Post
                  </Button>
               </CardFooter>
            </Card>
         </form>
      </Form>
   );
}
