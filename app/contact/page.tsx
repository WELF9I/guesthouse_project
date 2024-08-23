"use client"

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,8}$/, {
    message: "Please enter a valid phone number.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(500, {
    message: "Description must not exceed 500 characters.",
  }),
})

export const Contact = () => {
  const [submittedData, setSubmittedData] = useState(null);
  const [mailtoLink, setMailtoLink] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      description: "",
    },
  })

  function onSubmit(values:any) {
    console.log(values)
    setSubmittedData(values);

    const subject = encodeURIComponent("About the service");
    const body = encodeURIComponent(`
            Full Name: ${values.fullName}
            Email: ${values.email}
            Phone Number: ${values.phoneNumber}
            Description: ${values.description}
    `);

    const mailtoLink = `mailto:ihrissanek@gmail.com?subject=${subject}&body=${body}`;
    setMailtoLink(mailtoLink);
  }

  useEffect(() => {
    if (mailtoLink) {
      window.location.href = mailtoLink;
    }
  }, [mailtoLink]);

  return (
    <div className="min-h-screen bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundImage: "url('/about-1.jpg')" }}>
      <div className="max-w-md w-full mx-auto my-8 sm:my-16 md:my-24 lg:my-32 p-6 bg-gray-300 rounded-lg shadow-lg">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">Contact Us</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@example.com" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+12345678" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us more about your inquiry..." 
                      className="resize-none w-full" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm">
                    Please provide details about your inquiry (10-500 characters).
                  </FormDescription>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base py-2 sm:py-3">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Contact;