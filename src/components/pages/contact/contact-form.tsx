import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { receivingEmail } from "@/config/config";
import { $contact } from "@/config/strings";
import { ResetIcon, RocketIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Reducer, useReducer, useState } from "react";
// import { experimental_useFormStatus as useFormStatus } from "react-dom";

interface StateType {
  name: string;
  email: string;
  tel: string;
  subject: string;
  message: string;
}

const defaults: StateType = {
  name: "",
  email: "",
  tel: "",
  subject: "",
  message: "",
};

const ContactForm = () => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useReducer<Reducer<StateType, Partial<StateType>>>(
    (currentState, newState) => ({ ...currentState, ...newState }),
    defaults
  );

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setState({ [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Do the action in the Form HTML element
    // @ts-ignore
    const action = e?.target?.action;

    if (!action) {
      return;
    }

    if (!state.tel || !state.email) {
      console.error($contact.error.validation_phone_email);
      toast({
        title: "Message sent!",
        description: $contact.error.validation_phone_email,
      });
    }

    setIsLoading(true);
    const _res = await fetch(action, {
      method: "POST",
      body: JSON.stringify(state),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.status !== 200) {
          throw new Error(data.message);
        }
        return data;
      })
      .then((data) => {
        if (data?.error) {
          throw new Error(data.error?.message || data.error);
        }

        console.log(data);
        return data;
      })
      .then((data) => {
        toast({
          title: $contact.success.title,
          description: $contact.success.message,
        });

        handleReset();

        return data;
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: $contact.error.title,
          description: (
            <>
              <div className="flex flex-col space-y-2">
                <p>
                  {$contact.error.cta}{" "}
                  <Link
                    href={`mailto:${receivingEmail}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-splash underline"
                  >
                    {receivingEmail} ↗
                  </Link>
                  .
                </p>
                <p className="text-xs">
                  Error: {error.message || $contact.error.message}
                </p>
              </div>
            </>
          ),
          duration: 5000,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleReset = () => {
    setState(defaults);
  };

  return (
    <div className="my-6">
      <form
        onSubmit={handleSubmit}
        action="api/sendmail"
        // action="https://phpstack-1011481-3573429.cloudwaysapps.com/io.php"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{$contact.title}</CardTitle>

            <CardDescription>{$contact.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="tel">Phone</Label>
              <Input
                id="tel"
                type="tel"
                name="tel"
                autoComplete="tel"
                placeholder="+1 (415) 444-6660"
                onChange={handleChange}
                value={state.tel}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background text-muted-foreground px-2">
                  Or
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="richard@piedpiper.com"
                onChange={handleChange}
                value={state.email}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">
                Name<sup>*</sup>
              </Label>
              <Input
                required
                id="name"
                type="name"
                name="name"
                autoComplete="name"
                placeholder="Emmett Brown"
                onChange={handleChange}
                value={state.name}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="I need help with..."
                onChange={handleChange}
                value={state.subject}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">
                Message<sup>*</sup>
              </Label>
              <Textarea
                required
                id="message"
                name="message"
                placeholder="Please describe your project or issue..."
                onChange={handleChange}
                value={state.message}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={handleReset}>
              Reset <ResetIcon className="ml-2" />
            </Button>
            <SubmitButton pending={isLoading} />
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

const SubmitButton = ({ pending }: { pending?: boolean }) => {
  //   const { pending } = useFormStatus();
  return (
    <Button type="submit" {...(pending ? { disabled: true } : {})}>
      {$contact.submit}{" "}
      {pending ? (
        <Loader2 className="ml-2 size-4 animate-spin" />
      ) : (
        <RocketIcon className="ml-2" />
      )}
    </Button>
  );
};

export default ContactForm;
