
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

interface AutomatedMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  type: z.string({ required_error: "Please select a message type." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  sendToAll: z.boolean().default(false),
  scheduleDate: z.date().optional(),
  scheduleTime: z.string().optional(),
  triggerEvent: z.string().optional(),
});

const AutomatedMessageDialog = ({ open, onOpenChange }: AutomatedMessageDialogProps) => {
  const [isScheduled, setIsScheduled] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);
  const [date, setDate] = useState<Date>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      message: "",
      sendToAll: false,
      scheduleTime: "",
      triggerEvent: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, this would send data to your backend
    console.log(values);
    onOpenChange(false);
    form.reset();
    setIsScheduled(false);
    setIsTriggered(false);
    setDate(undefined);
  };

  const handleTypeChange = (value: string) => {
    form.setValue("type", value);
    
    if (value === "scheduled") {
      setIsScheduled(true);
      setIsTriggered(false);
    } else if (value === "triggered") {
      setIsScheduled(false);
      setIsTriggered(true);
    } else {
      setIsScheduled(false);
      setIsTriggered(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Automated Message</DialogTitle>
          <DialogDescription>
            Set up messages to be sent automatically to your clients.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Weekly Check-in" {...field} />
                  </FormControl>
                  <FormDescription>
                    Internal name for this automated message.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Type</FormLabel>
                  <Select onValueChange={handleTypeChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="immediate">Send Immediately</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="triggered">Event Triggered</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How and when this message will be sent.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isScheduled && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="scheduleDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scheduleTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input placeholder="e.g., 10:00 AM" {...field} />
                        </FormControl>
                        <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {isTriggered && (
              <FormField
                control={form.control}
                name="triggerEvent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trigger Event</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="missed_workout">Missed Workout</SelectItem>
                        <SelectItem value="completed_workout">Completed Workout</SelectItem>
                        <SelectItem value="upcoming_session">Upcoming Session (24h)</SelectItem>
                        <SelectItem value="weight_goal">Weight Goal Reached</SelectItem>
                        <SelectItem value="new_plan">New Plan Assigned</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      When this message will be automatically sent.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your message here..." 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    You can use {"{client_name}"} to personalize the message.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sendToAll"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Send to all clients
                    </FormLabel>
                    <FormDescription>
                      If unchecked, you'll be able to select specific clients.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Automated Message</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AutomatedMessageDialog;
