import { useEffect, useMemo, useState } from "react";
import { CONFIRM_MESSAGE, DELAY_SEARCH_TIME } from "@/constants";

import { Breadcrumbs, Button, IconButton, Link, Stack, Tooltip } from "@mui/material";

import { BookType, GetBookParams } from "@/models/book";
import { FilterValue, Metadata } from "@/models/common";
import { IQueryString } from "@/models/query";
import { formatDate } from "@/helpers/date";
import { useDeleteCategory } from "@/hooks/category";
import useDebounce from "@/hooks/common/useDebounce";
import { Datatable, FilterMenu, InputSearchUI } from "@/components/common";
import useDialogConfirm from "@/components/confirm-dialog/use-dialog-confirm";
import CreateBookDrawer from "@/components/drawer-right/create-edit-books-drawer";
import useDrawerRight from "@/components/drawer-right/use-drawer";
import Mainlayout from "@/components/layout/main-layout";

import { theme } from "@/theme";
import { DeleteIcon, EditIcon } from "@/assets/icons";

import data from "../../../jsons/books.json";
import { filterOptions } from "./constant";

const Books = () => {
  const [queryParams, setQueryParams] = useState<GetBookParams>({
    page: 1,
    limit: 25,
  });
  // const { isLoading, data } = useListCategory(queryParams);
  const { mutate: deleteContentBySlug } = useDeleteCategory();

  // Fix reload page when data undefined
  const [dataBook, setDataBook] = useState<BookType[]>([]);
  const [metaData, setDataMetadata] = useState<Metadata>({
    page: 1,
    limit: 25,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
  });

  useEffect(() => {
    if (data) {
      setDataBook(data?.data);
      setDataMetadata({ ...metaData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const drawer = useDrawerRight();
  const dialog = useDialogConfirm();

  const onCreate = () => {
    drawer.show({
      title: "Create Book",
      body: <CreateBookDrawer />,
      buttonText: "Create",
    });
  };

  const onEdit = (id: string) => {
    drawer.show({
      title: "Update Book",
      body: <CreateBookDrawer isEdit idItem={id} />,
      buttonText: "Update",
    });
  };

  const deleteCategory = (id: string) => {
    dialog.show({
      title: "Delete Book ?",
      description: CONFIRM_MESSAGE.CM1,
      color: theme.palette.red[500],
      callbackYes: () => {
        deleteContentBySlug({ ids: [id] });
      },
    });
  };

  const handleSearch = useDebounce((keyword: string) => {
    const _params = { ...queryParams, page: 1 };
    if (keyword) _params.search = keyword;
    else delete _params.search;
    return setQueryParams(_params);
  }, DELAY_SEARCH_TIME);

  const filterValue: FilterValue = useMemo(() => {
    return {
      f_name: queryParams.f_name,
    };
  }, [queryParams]);

  const onChangeFilter = (value: FilterValue | Partial<IQueryString>) => {
    const _params = { ...queryParams };
    delete _params.f_name;
    setQueryParams({
      ..._params,
      ...value,
      page: 1,
    });
  };

  return (
    <>
      <Mainlayout>
        <Mainlayout.Header>
          <Stack
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              height: "41px",
            }}
          >
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="inherit">
                Books
              </Link>
            </Breadcrumbs>

            <Stack direction="row" spacing={1}>
              <InputSearchUI onChange={(keyword) => handleSearch(keyword)} />
              <FilterMenu
                filterOptions={filterOptions}
                filterValue={filterValue}
                onChange={onChangeFilter}
                //TODO
                //  fetchDataOption={fetchDataOption}
              />
            </Stack>

            <Stack flexDirection="row" gap={1}>
              <Button variant="contained" onClick={onCreate}>
                Create
              </Button>
            </Stack>
          </Stack>
        </Mainlayout.Header>
        <Mainlayout.Body>
          <>
            {/* {isLoading && <GlobalLoader isLoading={isLoading} />} */}
            <Datatable
              pageSize={metaData.limit}
              pageIndex={metaData.page}
              pageTotal={metaData.totalPages}
              rowTotal={metaData.totalCount}
              data={dataBook}
              onSortChange={(e) => {
                const { sort_by, sort_direction } = e;
                setQueryParams({
                  ...queryParams,
                  sort: sort_direction === "asc" ? sort_by : `-${sort_by}`,
                });
              }}
              onPageChange={(e) => {
                const { pageIndex, pageSize } = e;
                setQueryParams({ ...queryParams, page: pageIndex, limit: pageSize });
              }}
            >
              <Datatable.ColTemplate>
                <Datatable.HeadCell
                  sortable={true}
                  name="id_sach"
                  text="ID"
                  sx={{ width: "200px" }}
                ></Datatable.HeadCell>
                <Datatable.BodyCell field="id_sach"></Datatable.BodyCell>
              </Datatable.ColTemplate>
              <Datatable.ColTemplate>
                <Datatable.HeadCell
                  sortable={true}
                  name="ten"
                  text="Tên Sách"
                  sx={{ width: "200px" }}
                ></Datatable.HeadCell>
                <Datatable.BodyCell field="ten"></Datatable.BodyCell>
              </Datatable.ColTemplate>
              <Datatable.ColTemplate>
                <Datatable.HeadCell
                  sortable={true}
                  name="language"
                  text="Ngôn Ngữ"
                  sx={{ width: "200px" }}
                ></Datatable.HeadCell>
                <Datatable.BodyCell field="language"></Datatable.BodyCell>
              </Datatable.ColTemplate>
              <Datatable.ColTemplate>
                <Datatable.HeadCell
                  sortable={true}
                  name="anh"
                  text="Bìa Sách"
                  sx={{ width: "200px" }}
                ></Datatable.HeadCell>
                <Datatable.BodyCell>
                  {(data: BookType) => <img src={data.anh} alt={data.anh} height="30px" />}
                </Datatable.BodyCell>
              </Datatable.ColTemplate>
              {/* <Datatable.ColTemplate>
                <Datatable.HeadCell
                  sx={{ width: "200px" }}
                  sortable={true}
                  name="status"
                  text="Status"
                ></Datatable.HeadCell>
                <Datatable.BodyCell>
                  {(data: StaticContentType) => (
                    <Stack flexDirection="row" alignItems="center" textTransform="capitalize">
                      <span
                        style={{
                          display: "block",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: colorStatus[data.status],
                          marginRight: "5px",
                        }}
                      ></span>
                      {data.status}
                    </Stack>
                  )}
                </Datatable.BodyCell>
              </Datatable.ColTemplate> */}
              <Datatable.ColTemplate>
                <Datatable.HeadCell
                  sortable={true}
                  name="ngayxuatban"
                  text="Ngày Xuất Bản"
                  sx={{ width: "200px" }}
                ></Datatable.HeadCell>
                <Datatable.BodyCell>
                  {(data: BookType) => <>{formatDate(data.ngayxuatban)}</>}
                </Datatable.BodyCell>
              </Datatable.ColTemplate>
              <Datatable.ColTemplate>
                <Datatable.HeadCell
                  sticky
                  sx={{ width: "140px" }}
                  name="action"
                  text="Action"
                ></Datatable.HeadCell>
                <Datatable.BodyCell>
                  {(data: BookType) => (
                    //import data: Admin when handle onEditStaticContent/deleteStaticContent
                    <Stack flexDirection="row" alignItems="center" gap={0.5}>
                      <Tooltip title="Update" placement="top">
                        <span>
                          <IconButton
                            onClick={() => {
                              onEdit(data.id_sach);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Delete" placement="top">
                        <span>
                          <IconButton onClick={() => deleteCategory(data.id_sach)}>
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  )}
                </Datatable.BodyCell>
              </Datatable.ColTemplate>
            </Datatable>
          </>
        </Mainlayout.Body>
      </Mainlayout>
    </>
  );
};

export default Books;
