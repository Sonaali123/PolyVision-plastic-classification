/**
 * v0 by Vercel.
 * @see https://v0.dev/t/dEkRXTTmVxc
 */
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function App() {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [responseJson, setResponseJson] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
      setFile(file);
    }
  };

  const handleSubmit = async () => {
    try {
      if (file == null) {
        alert("Kindly select the image file");
      } else {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://127.0.0.1:8000/predict", {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        });

        const data = await response.json();
        console.log("Response from server:", data);
        setResponseJson(data);
      }
    } catch (error) {
      
      console.error("Error during file upload:", error);
    }
  };
  return (
    <main className="flex flex-col items-center justify-center space-y-8 h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>
            Select an image to preview and submit.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-upload">Image</Label>
            <Input
              className="w-full"
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="flex justify-center">
            {image == null ? (
              <div className="border-2 border-gray-300 rounded h-56 w-56"></div>
            ) : (
              <img
                alt="Selected image preview"
                className="border-2 border-gray-300 rounded"
                height="200"
                src={image}
                style={{
                  aspectRatio: "200/200",
                  objectFit: "cover",
                }}
                width="200"
              />
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" onClick={handleSubmit}>
            Submit
          </Button>
          {responseJson && (
            <div className="mt-4">
              <strong>Response from server:</strong>
              <pre>{JSON.stringify(responseJson, null, 2)}</pre>
            </div>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}
