"use client";

import { Suspense, use } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function EditPollForm({ id }) {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await fetch(`/api/polls/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch poll");
        }
        const data = await response.json();
        setTitle(data.title);
        setOptions(data.options.map((option) => option.text));
        setImagePreview(data.imageUrl);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching poll:", error);
        setError("Failed to fetch poll. Please try again.");
        setIsLoading(false);
      }
    };
    fetchPoll();
  }, [id]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, ""]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status !== "authenticated") {
      setError("You must be logged in to edit a poll");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      options.forEach((option, index) => {
        formData.append(`options[${index}]`, option);
      });
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(`/api/polls/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        router.push("/");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error updating poll:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Poll</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Poll Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          {options.map((option, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`option-${index}`}>Option {index + 1}</Label>
              <Input
                id={`option-${index}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
            </div>
          ))}
          {options.length < 5 && (
            <Button
              type="button"
              onClick={addOption}
              variant="secondary"
              className="w-full"
            >
              Add Option
            </Button>
          )}
          <div className="space-y-2">
            <Label htmlFor="image">Poll Image</Label>
            <div className="flex items-center space-x-4">
              {imagePreview && (
                <div className="relative w-24 h-24">
                  <Image
                    src={imagePreview}
                    alt="Poll image preview"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              )}
              <Label
                htmlFor="image"
                className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-md cursor-pointer hover:border-primary"
              >
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Upload className="w-6 h-6 text-gray-400" />
              </Label>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Poll"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function Page({ params }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <EditPollForm id={use(params).id} />
    </Suspense>
  );
}
