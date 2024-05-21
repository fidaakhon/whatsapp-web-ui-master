import Icon from "common/components/icons";
import { SearchWrapper, IconContainer, Input } from "./styles";
import { useState, useEffect, useMemo } from "react";

type SearchFieldProps = {
  placeholder?: string;
  [x: string]: any;
};

export default function SearchField(props: SearchFieldProps) {
  const { placeholder, onContactSearch, ...rest } = props;
  const [searchValue, setSearchValue] = useState("");

  const searchhandle = (element: string) => {
    console.log(element);
    setSearchValue(element);
    onContactSearch(searchValue);
  };

  useEffect(() => {
    if (typeof onContactSearch === 'function') {
      onContactSearch(searchValue);
    } else {
      console.log("onContactSearch is not a function");
    }
  }, [searchValue, onContactSearch]);




  return (
    <SearchWrapper {...rest}>
      <IconContainer>
        <Icon id="search" className="search-icon" />
        <button className="search__back-btn">
          <Icon id="back" />
        </button>
      </IconContainer>
      <Input placeholder={placeholder ?? "Search or start a new chat"} onChange={(e) => searchhandle(e.target.value)} />
    </SearchWrapper>
  );
}
