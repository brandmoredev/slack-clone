"use client"

import { useCurrentUser } from "@/features/auth/api/useCurrentUser"
import { useGetChannelMembers } from "@/features/channelMembers/api/useGetChannelMembers"
import { useGetMembers } from "@/features/members/api/useGetMembers"
import { useChannelId } from "@/hooks/useChannelId"
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId"
import { Loader } from "lucide-react"
import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef } from "react"
import { ReactTags, type ReactTagsAPI } from "react-tag-autocomplete"
import type { ClassNames, ListBoxRenderer, ListBoxRendererProps, OptionRenderer, OptionRendererProps, TagOption, TagSuggestion } from 'react-tag-autocomplete'


export type CustomTagSuggestion = TagSuggestion & {
  name?: string,
  email?: string,
  image?: string
}

type CustomTagOption = TagOption & {
  name?: string,
  email?: string,
  image?: string
}

interface MemberSelectorProps {
  classNames?: Partial<ClassNames>,
  selected: CustomTagSuggestion[],
  setSelected: Dispatch<SetStateAction<CustomTagSuggestion[]>>,
  type: "invite" | "message"
}


const defaultClassNames: ClassNames = {
  root: "react-tags border p-2",
  rootIsActive: "is-active",
  rootIsDisabled: "is-disabled",
  rootIsInvalid: "is-invalid",
  label: "react-tags__label",
  tagList: "react-tags__list flex flex-wrap gap-2",
  tagListItem: "react-tags__list-item bg-sky-200 py-1 px-2 rounded-sm",
  tag: "react-tags__tag",
  tagName: "react-tags__tag-name",
  comboBox: "react-tags__combobox relative",
  input: "react-tags__combobox-input caret-black focus:outline-none",
  listBox: "react-tags__listbox h-[350px]",
  option: "react-tags__listbox-option",
  optionIsActive: "is-active",
  highlight: "react-tags__listbox-option-highlight",
}


const CustomListBox: ListBoxRenderer = (props: ListBoxRendererProps) => {
  const { children } = props
  return (
    <div className="w-full absolute bg-[#F8F8F8] shadow-md border rounded-lg min-h-10 p-2">
      {children}
    </div>
  )
}

const CustomOption: OptionRenderer = (props: OptionRendererProps) => {
  const { children, option, ...optionProps } = props;
  return (
    <div className="hover:bg-accent py-1 gap-0" {...optionProps}>
      {children}
      <p className="w-full text-muted-foreground text-sm">{(option as CustomTagOption).email}</p>
    </div>
  );
};

export const MemberSelector  = ({ classNames, selected, setSelected, type }: MemberSelectorProps) => {
  const channelId = useChannelId()
  const workspaceId = useWorkSpaceId()
  const { data: channelMembers, isLoading: channelMembersLoading } = useGetChannelMembers({ channelId })
  const { data: workspaceMembers, isLoading: workspaceMembersLoading } = useGetMembers({ workspaceId })
  const { data: user, isLoading: userLoading } = useCurrentUser()
  

  const reactTagsRef = useRef<ReactTagsAPI>(null)

  useEffect(() => {
    reactTagsRef.current?.input.focus()
  }, [])

  const onAdd = useCallback(
  (newTag: TagSuggestion) => {
    setSelected([...selected, newTag])
  },[selected, setSelected])

  const onDelete = useCallback(
    (tagIndex: unknown) => {
      setSelected(selected.filter((_, i) => i !== tagIndex))
    },[selected, setSelected])


  if (type === "message" && channelMembersLoading) {
    return (
      <div className="h-full flex items-center justify-self-center">
        <Loader className="size-5 animate-spin text-muted-foreground"/>
      </div>
    )
  }

  if (type === "invite" && workspaceMembersLoading) {
    return (
      <div className="h-full flex items-center justify-self-center">
        <Loader className="size-5 animate-spin text-muted-foreground"/>
      </div>
    )
  }

  if (userLoading) {
    return (
      <div className="h-full flex items-center justify-self-center">
        <Loader className="size-5 animate-spin text-muted-foreground"/>
      </div>
    )
  }

  const members = type === "invite" ? workspaceMembers : channelMembers;

  const suggestions: CustomTagSuggestion[] = (members ?? [])
    .filter((member) => member.user._id !== user?._id)
    .map((item) => ({
      value: item.userId,
      label: item.user.name ?? item.user.email!,
      name: item.user.name,
      email: item.user.email,
      image: item.user.image,
      disabled: user?._id === item.userId
    }))

  // const suggestions = dummyitem.users


  return (
    <ReactTags
      ref={reactTagsRef}
      labelText=""
      placeholderText={!selected ? "ex. Nathalie, john@acme.com" : ""}
      selected={selected}
      suggestions={suggestions}
      onAdd={onAdd}
      onDelete={onDelete}
      noOptionsText="No matching item.user"
      classNames={{...defaultClassNames, ...classNames}}
      renderListBox={CustomListBox}
      renderOption={CustomOption}
      suggestionsTransform={(inputValue, suggestionsList) => {
        const selectedValues = new Set(selected.map(tag => tag.value))
        const input = inputValue.trim().toLowerCase()

        if (!input) return []

        return suggestionsList.filter((suggestion) => {
          const isAlreadySelected = selectedValues.has(suggestion.value)
          const matchesInput = suggestion.label.toLowerCase().includes(input)
          return !isAlreadySelected && matchesInput
        })
      }}
      onShouldExpand={(inputValue) => inputValue.trim().length > 0}
      onShouldCollapse={(inputValue) => inputValue.trim().length === 0}
    />
  )
}