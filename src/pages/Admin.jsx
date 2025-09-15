import { useQuery } from "@tanstack/react-query";
import axios from "../lib/axios";
import React from "react";
import ChangePassword from "./ChangePassword";
import AddPassword from "./AddPassword";
import Loader from "../components/Loader";
import GroupsButton from "../components/GroupsButton";

function Admin() {
  const { data: admin, isFetching } = useQuery({
    queryFn: () => axios.get("/admin").then((res) => res.data),
  });

  return (
    <>
      <div className="flex gap-2 absolute left-5 top-5">
        <GroupsButton />
      </div>
      {isFetching ? (
        <Loader className="mt-96" />
      ) : (
        <>{admin?.length > 0 ? <ChangePassword /> : <AddPassword />}</>
      )}
    </>
  );
}

export default React.memo(Admin);
