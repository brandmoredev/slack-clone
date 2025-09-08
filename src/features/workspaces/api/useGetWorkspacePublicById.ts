"use client"

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetWorkspacePublicProps {
  id: Id<"workspaces">
}
export const useGetWorkspacePublicById = ({ id }: useGetWorkspacePublicProps) => {
  const data = useQuery(api.workspaces.getPublicInfoById,{ id });
  const isLoading = data === undefined;

  return { data, isLoading };
};

