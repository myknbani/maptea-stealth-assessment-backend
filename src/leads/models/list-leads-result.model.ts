import { createPaginationMetadata } from '../../common/utils/create-pagination-metadata';
import { Lead } from './lead.entity';
import { PageInfo } from '../../common/models/page-info.model';
import { ObjectType } from '@nestjs/graphql';

/**
 * Represents the result of listing leads.  It adds pagination metadata on top of the data.
 */
@ObjectType()
export class ListLeadsResult {
  /**
   * Information about the current page of leads.
   */
  pageInfo: PageInfo;

  /**
   * The list of leads for the current page.
   */
  records: Lead[];

  constructor(leads: Lead[], totalItemsCount: number, currentPage: number, itemsPerPage: number) {
    this.pageInfo = createPaginationMetadata(totalItemsCount, currentPage, itemsPerPage);
    this.records = leads;
  }
}
