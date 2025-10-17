import Table from "../Global/Table";
import { useState, useEffect } from "react";
import { useOverLay } from "../../Contexts/OverLayContext";
import { Link } from "react-router-dom";
import { AddGroup, View } from "../Global/Icons";
import useFetching from "../../Hooks/useFetching";

function Teams({ type, onRowDoubleClick }) {
  const { fetchData } = useFetching();
  const [teams, setTeams] = useState([]);
  const { isLoading } = useOverLay();
  useEffect(() => {
    const fetchTeams = async () => {
      await fetchData("teams.php", setTeams);
    };
    fetchTeams();
  }, []);
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "teamName", headerName: "Team Name", width: 130 },
    {
      field: "description",
      headerName: "description",
      width: 400,
      sortable: true,
    },
  ];
  if (!type) {
    columns.push({
      field: "view",
      headerName: "View",
      description: "This column is to View.",
      sortable: false,
      width: 100,

      renderCell: (params) => {
        return (
          <Link
            to={`${params.id}`}
            className="w-full h-full text-center flex justify-center items-center"
          >
            <View />
          </Link>
        );
      },
    });
  }
  return (
    <>
      {!isLoading && (
        <div className=" h-full w-full  grid grid-cols-1 px-4 mx-auto mb-10 fadeIn">
          {!type && (
            <div className="py-10 flex justify-between">
              <div className="">All Teams</div>
              <div className="">
                <Link
                  to="add"
                  className="w-full h-full text-center flex justify-center items-center"
                >
                  <AddGroup />
                </Link>
              </div>
            </div>
          )}

          <div className="w-full">
            <Table
              rows={teams}
              columns={columns}
              onRowDoubleClick={onRowDoubleClick}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Teams;
