"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function VotingForm({ poll }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log('Poll data received:', poll);
    
    if (poll && Array.isArray(poll.options)) {
      console.log('Options found:', poll.options);
      setIsLoading(false);
    } else {
      console.log('Invalid poll data structure:', poll);
      setError("Invalid poll data structure");
    }
  }, [poll]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!poll || !Array.isArray(poll.options) || poll.options.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {!poll ? "No poll data available." : 
           !Array.isArray(poll.options) ? "Invalid poll options structure." :
           "No options available for this poll."}
        </AlertDescription>
        <pre className="mt-2 text-xs">
          {JSON.stringify(poll, null, 2)}
        </pre>
      </Alert>
    );
  }

  const handleVote = async (e) => {
    e.preventDefault();
    if (selectedOption === null) {
      setError("Please select an option");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/polls/${poll._id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ optionIndex: selectedOption }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error('Vote submission error:', error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleVote} className="space-y-4">
      <RadioGroup
        value={selectedOption !== null ? selectedOption.toString() : undefined}
        onValueChange={(value) => {
          setSelectedOption(parseInt(value, 10));
          setError("");
        }}
      >
        <div className="space-y-2">
          {poll.options.map((option, index) => (
            <div key={index} className="flex items-center p-2 space-x-2 rounded hover:bg-gray-50">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                <span className="text-lg">{option.text}</span>
                <span className="ml-2 text-sm text-gray-500">
                  ({option.votes} votes)
                </span>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Voting...
          </>
        ) : (
          "Vote"
        )}
      </Button>
    </form>
  );
}
