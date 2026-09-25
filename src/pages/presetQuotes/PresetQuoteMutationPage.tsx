import { showErrorToast } from "@/api/axiosInstance";
import { assets } from "@/assets/icons";
import { CustomActionGroup } from "@/components/common/CustomActionGroup";
import { HeaderBreadCrumb } from "@/components/common/CustomBreadCrumb";
import { CustomBtn } from "@/components/common/CustomBtn";
import { CustomHeader } from "@/components/common/CustomHeader";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomDataTable } from "@/components/common/CustomTable";
import {
  CustomToggleGroup,
  type CustomToggleGroupProps,
} from "@/components/common/CustomToggleGroup";
import SearchInputGruop from "@/components/common/SearchInputGruop";
import ItemForm, { type ItemFormProps } from "@/components/items/ItemForm";
import { Spinner } from "@/components/ui/spinner";
import useItemsList from "@/hooks/apis/items/useItemsList";
import useItemsMutations from "@/hooks/apis/items/useItemsMutations";
import usePresetQuoteDetails from "@/hooks/apis/quotes/usePresetQuoteDetails";
import usePresetQuoteMutations from "@/hooks/apis/quotes/usePresetQuoteMutations";
import { cn, formatCurrency } from "@/lib/utils";
import type { CreatePresetQuote } from "@/types/api.requests.type";
import type { ItemDetails } from "@/types/api.responses.type";
import type { ItemCreationPayload } from "@/types/itemCreation.payload.type";
import type { ItemEditPayload } from "@/types/itemEdit.payload.type";
import { presetQuoteMutationSchema } from "@/validation/presetQuoteMutation.payload.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

enum PageToggle {
  summary = "Summary",
  items = "Items",
}

function PresetQuoteMutationPage() {
  const params = useParams<{ id: string | undefined }>();
  const navigate = useNavigate();
  const [activeToggle, setActiveToggle] = useState<string>(PageToggle.summary);
  const [itemModalOpen, toggleItemModal] = useState(false);
  const itemFormMode = useRef<ItemFormProps["mode"]>("creation");
  const targetItem = useRef<ItemDetails | undefined>(undefined);
  const toggles: CustomToggleGroupProps["toggleConfig"] = [
    {
      btnId: PageToggle.summary,
      btnLabel: PageToggle.summary,
    },
    {
      btnId: PageToggle.items,
      btnLabel: PageToggle.items,
      disabled: params.id === undefined,
    },
  ];
  const { presetQuote, isFetching: isPresetFetching } = usePresetQuoteDetails({
    templateId: params.id ?? "",
    enabled: params.id !== undefined,
  });

  const { createItemMutation, updateItemMutation } = useItemsMutations();
  const { presetQuoteCreateMutation, presetQuoteUpdateMutation } =
    usePresetQuoteMutations();

  const {
    searchTerm,
    setSearchTerm,
    setPageNo,
    itemsList,
    paginationMeta,
    isFetching: isItemsFetching,
    refetch: refetchItemsList,
  } = useItemsList({});

  const initialValue = {
    name: "",
    description: "",
    quote_description: "",
    items: [],
  } as CreatePresetQuote;

  const { control, setValue, handleSubmit } = useForm<CreatePresetQuote>({
    defaultValues: initialValue,
    resolver: yupResolver(presetQuoteMutationSchema),
  });

  const handlePresetSave = (payload: CreatePresetQuote) => {
    if (!params.id) {
      presetQuoteCreateMutation.mutate(payload, {
        onSuccess: (response) => {
          toast.success(response.message);
          navigate(
            `/preset-quotes/manage-preset-quotes/${response.payload.id}`,
          );
        },
        onError: (error) => {
          showErrorToast(error);
        },
      });
    } else {
      presetQuoteUpdateMutation.mutate(
        {
          id: params.id,
          ...payload,
        },
        {
          onSuccess: (response) => {
            toast.success(response.message);
            if (activeToggle === PageToggle.items) {
              navigate(`/preset-quotes/${response.payload.id}`);
            } else {
              setActiveToggle(PageToggle.items);
            }
          },
          onError: (error) => {
            showErrorToast(error);
          },
        },
      );
    }
  };

  const [addedItems] = useWatch({
    control: control,
    name: ["items"],
  });

  const getItemIdx = (itemId: number) =>
    addedItems?.findIndex((item) => item.id === itemId) ?? -1;

  const decrementQty = (itemId: number) => {
    const idx = getItemIdx(itemId);
    if (idx === -1) {
      return;
    }
    const itemsArr = addedItems ?? [];
    const qty = itemsArr[idx].quantity;

    if (qty === 1) {
      setValue("items", itemsArr.toSpliced(idx, 1));
    } else {
      setValue("items", [
        ...itemsArr.slice(0, idx),
        {
          ...itemsArr[idx],
          quantity: qty - 1,
        },
        ...itemsArr.slice(idx + 1),
      ]);
    }
  };

  const incrementQty = (item: ItemDetails) => {
    const idx = getItemIdx(item.id);
    if (idx === -1) {
      setValue("items", [...(addedItems ?? []), item]);
    } else {
      const itemArr = addedItems ?? [];
      setValue("items", [
        ...itemArr.slice(0, idx),
        {
          ...itemArr[idx],
          quantity: itemArr[idx].quantity + 1,
        },
        ...itemArr.slice(idx + 1),
      ]);
    }
  };

  const itemColumns: ColumnDef<TableFeatures, ItemDetails>[] = [
    {
      accessorKey: "name",
      header: "Item name",
      enableSorting: false,
    },
    {
      accessorKey: "category_name",
      header: "Category",
      enableSorting: false,
    },
    {
      accessorKey: "subcategory_name",
      header: "Subcategory",
      enableSorting: false,
    },
    {
      accessorKey: "unit",
      header: "UNIT",
      enableSorting: false,
    },
    {
      accessorKey: "price",
      header: "Price/unit",
      enableSorting: false,
      cell: (info) => formatCurrency(info.getValue<number>()),
    },
    {
      id: "quantity",
      header: "Quantity",
      cell: (info) => {
        if (!addedItems) {
          setValue("items", []);
        }
        const { id } = info.row.original;
        const itemIdx = getItemIdx(id);
        const qty = itemIdx == -1 ? 0 : addedItems?.at(itemIdx)?.quantity;
        return (
          <CustomBtn
            leftIcon={assets.minusIconBlue}
            leftAction={() => decrementQty(id)}
            buttonLabel={`${qty}`}
            rightIcon={assets.plusIconBlue}
            rightAction={() => incrementQty(info.row.original)}
            btncls={cn(
              `bg-transparent hover:bg-transparent text-black-text border border-brand-dark`,
            )}
          />
        );
      },
    },
    {
      id: "total",
      header: "Total",
      accessorFn: (item) => {
        if (!addedItems) {
          return 0;
        }
        const idx = getItemIdx(item.id);
        if (idx === -1) {
          return 0;
        }
        return addedItems[idx].quantity * item.price;
      },
      enableSorting: false,
      cell: (info) => formatCurrency(info.getValue<number>()),
    },
    {
      id: "action",
      header: "Action",
      cell: (info) => {
        const item = info.row.original;
        return (
          <CustomActionGroup
            withOpen={false}
            editFn={() => {
              itemFormMode.current = "updation";
              targetItem.current = item;
              toggleItemModal((curr) => !curr);
            }}
          />
        );
      },
    },
  ];

  const handleItemCreate = async (data: ItemCreationPayload) => {
    await createItemMutation.mutateAsync(
      {
        name: data.name,
        category_id: Number(data.catId),
        subcategory_id: Number(data.subCatId),
        unit: data.unit,
        price: data.pricePerUnit,
        cost: data.unitPrice,
        type: "product",
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          refetchItemsList();
          setPageNo(1);
          toggleItemModal(false);
        },
        onError: (error) => {
          showErrorToast(error);
        },
      },
    );
  };

  const itemEditHandler = async (data: ItemEditPayload) => {
    await updateItemMutation.mutateAsync(
      {
        id: Number(targetItem.current?.id ?? "0"),
        name: data.name,
        category_id: data.catId ? Number(data.catId) : undefined,
        subcategory_id: data.subCatId ? Number(data.subCatId) : undefined,
        cost: data.unitPrice,
        price: data.pricePerUnit,
        unit: data.unit,
        type: "product",
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          refetchItemsList();
          toggleItemModal(false);
        },
        onError: (error) => {
          showErrorToast(error);
        },
      },
    );
  };

  useEffect(() => {
    if (params.id && presetQuote) {
      setValue("name", presetQuote.name);
      setValue("description", presetQuote.description ?? "");
      setValue("quote_description", presetQuote.quote_description ?? "");
      setValue("items", presetQuote.items);

      if (presetQuote.items.length <= 0) {
        setActiveToggle(PageToggle.items);
      }
    }
  }, [params.id, presetQuote]);

  return (
    <>
      {isPresetFetching ? (
        <div className="w-full h-full flex items-center justify-center">
          {" "}
          <Spinner className="text-brand-dark w-1/10 h-1/10" />{" "}
        </div>
      ) : (
        <>
          <HeaderBreadCrumb
            pageName={params.id ? `Edit Quote Preset` : `Add Quote Preset`}
          />

          <div className="p-6 flex flex-col gap-6">
            <CustomHeader header="Add Quote Preset" btnConfigList={[]} />

            <div className="flex flex-col py-5 gap-8 bg-preset-muatation-secondary rounded-[10px]">
              <CustomToggleGroup
                toggleConfig={toggles}
                activeId={activeToggle}
                toggleActive={setActiveToggle}
                btnCls={cn(
                  `bg-transparent hover:bg-transparent text-black-text [.btnActive]:text-brand-dark [.btnActive]:border-b [.btnActive]:border-brand-dark`,
                )}
                className={cn(`flex gap-2 `)}
                containerCls="px-5 pb-0"
              />

              <div>
                {activeToggle === PageToggle.summary && (
                  <div className="p-5 flex flex-col gap-6">
                    <CustomInput
                      control={control}
                      name="name"
                      fieldName="Template Name"
                      placeholder="e.g. Standard Boiler Install"
                    />

                    <CustomInput
                      control={control}
                      name="description"
                      fieldName="Job Description"
                      inptType="textarea"
                      placeholder="Enter job details..."
                    />
                  </div>
                )}

                {activeToggle === PageToggle.items && (
                  <div className="bg-table flex flex-col gap-5">
                    <CustomDataTable
                      columns={itemColumns}
                      data={itemsList ?? []}
                      showPaginated
                      paginationMeta={paginationMeta}
                      paginationBtns={paginationMeta?.links}
                      isFetching={isItemsFetching}
                      setPageNo={setPageNo}
                      tableOptionsLeft={
                        <SearchInputGruop
                          searchPlaceHolder="Search items"
                          searchTerm={searchTerm}
                          setSearchTerm={setSearchTerm}
                        />
                      }
                      tableOptionsRight={
                        <CustomBtn
                          buttonLabel="New Item"
                          leftIcon={assets.plusIcon}
                          onClick={() => {
                            itemFormMode.current = "creation";
                            targetItem.current = undefined;
                            toggleItemModal((curr) => !curr);
                          }}
                        />
                      }
                    />
                  </div>
                )}
              </div>

              <CustomBtn
                buttonLabel="Save"
                btncls="ml-5 min-w-[150px]"
                onClick={handleSubmit(handlePresetSave)}
                isSubmitting={
                  presetQuoteCreateMutation.isPending ||
                  presetQuoteUpdateMutation.isPending
                }
              />
            </div>
          </div>
        </>
      )}
      <ItemForm
        mode={itemFormMode.current}
        isOpen={itemModalOpen}
        toggleIsOpen={toggleItemModal}
        currItem={
          itemFormMode.current === "updation" ? targetItem.current : undefined
        }
        creationFn={handleItemCreate}
        editFn={itemEditHandler}
        isPending={createItemMutation.isPending || updateItemMutation.isPending}
      />
    </>
  );
}

export default PresetQuoteMutationPage;
