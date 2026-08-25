import Link from "@/components/common/link";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { paths } from "@/config/paths";
import type { Post } from "@/types";

const PostCard = ({ post }: { post: Post }) => {
   return (
      <Card className="inline-block break-inside-avoid mb-4 max-w-sm flex-1/2 h-auto">
         <CardHeader>
            <CardTitle className="text-xl font-bold">{post.title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
               {post.body}
            </CardDescription>
         </CardHeader>
         <CardFooter className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{`Created by ${post.author?.first_name || post.author_id || "Art Space"}`}</p>
            <Link to={`${paths.blog.detail.getHref(post.slug)}`}>
               <Button variant="outline">Read</Button>
            </Link>
         </CardFooter>
      </Card>
   );
};

export default PostCard;
