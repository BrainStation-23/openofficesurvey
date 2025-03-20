
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

const AdminOKRTemplates = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">OKR Templates</h1>
        <Button asChild>
          <Link to="/admin/okrs/templates/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Template
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>OKR Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will display all OKR templates and allow you to manage them.
            This page is under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOKRTemplates;
